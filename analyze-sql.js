const fs = require('fs');
const path = require('path');
const axios = require('axios');

const migrationsDir = './scripts'; // This could be anything,,,,

const migrationFiles = fs.readdirSync(migrationsDir);
const allChanges = [];

async function main() {
  if (migrationFiles.length > 0) {
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
  
      // Analyze the SQL script using OpenAI
      const analysis = await sendToOpenAI(content);
  
      // Collect the analysis results
      allChanges.push(analysis);
    }
  }

  const documentation = migrationFiles.length > 0 ? `Database Changes to Vakuushallinta:\n\n${allChanges.join('\n\n')}` : "No database changes found.";
  console.log(documentation);

  // Post the documentation to Teams
  // await sendToTeams(documentation);
}

async function sendToOpenAI(sql) {
  const apikey = "your_openai_api_key"; // Your OpenAI API key here

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: "gpt-4o-mini",
      messages: [
          { role: "system", content: `You are an assistant that analyzes SQL scripts and generates structured database change documentation. 
                        Format the output like this:

                        - [Table name]
                            - [Description of the change]
                            - [Description of the change]

                        Example:
                        - Users
                            - Added nullable column 'email' of type varchar(255)
                            - Modified column 'username' type from varchar(50) to varchar(100)
                            - Added not nullable column 'created_at' of type timestamp
                        - Orders
                            - Deleted column 'order_status'` },
          {
              role: "user",
              content: `Analyze the following SQL script and summarize changes:\n\n${sql}`,
          },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${apikey}`
      }
    }
  );

  // Uncomment the line below to see the full response from OpenAI
  // console.log(`Response from OpenAI: ${JSON.stringify(response.data, null, 2)}`);
  return response.data.choices[0].message.content;
}

// Not yet implemented
const sendToTeams = async (message) => {
  const webhookUrl = 'your_teams_webhook_url';
  await axios.post(webhookUrl, { text: message });
};

main().catch(error => {
  console.error('Error during analysis:', error);
});
