const fs = require("fs");
const path = require("path");
const axios = require("axios");
const simpleGit = require("simple-git");

const migrationsDir = "./scripts"; // This could be anything,,,,

const git = simpleGit();

const allChanges = [];

async function main() {
  const baseBranch = "main";
  const currentBranch = "feature/branch";
  const targetDirectory = "db/VakuushallintaDemo/up";

  // Get the SQL files from the git diff
  const sqlFiles = await getSQLfilesFromGitDiff(
    baseBranch,
    currentBranch,
    targetDirectory
  );
  const roundhouseScripts = sqlFiles.filter((file) => file.endsWith(".sql"));

  if (roundhouseScripts.length > 0) {
    for (const file of sqlFiles) {
      const filePath = path.join(migrationsDir, file);
      const content = fs.readFileSync(filePath, "utf8");

      // Analyze the SQL script using OpenAI
      const analysis = await sendToOpenAI(content);

      // Collect the analysis results
      allChanges.push(analysis);
    }
  }

  const documentation =
    sqlFiles.length > 0
      ? `Database Changes to Vakuushallinta:\n\n${allChanges.join("\n\n")}`
      : "No database changes found.";
  console.log(documentation);

  // Post the documentation to Teams
  // await sendToTeams(documentation);
}

async function sendToOpenAI(sql) {
  const apikey =
    "your_openai_api_key"; // Your OpenAI API key here

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an assistant that analyzes SQL scripts and generates structured database change documentation. 
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
                            - Deleted column 'order_status'`,
        },
        {
          role: "user",
          content: `Analyze the following SQL script and summarize changes:\n\n${sql}`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${apikey}`,
      },
    }
  );

  // Uncomment the line below to see the full response from OpenAI
  // console.log(`Response from OpenAI: ${JSON.stringify(response.data, null, 2)}`);
  return response.data.choices[0].message.content;
}

// Not yet implemented ¯\_(ツ)_/¯
const sendToTeams = async (message) => {
  const webhookUrl = "your_teams_webhook_url";
  await axios.post(webhookUrl, { text: message });
};

async function getSQLfilesFromGitDiff(
  baseBranch,
  currentBranch,
  targetDirectory
) {
  try {
    await git.checkout(currentBranch);

    const diffFiles = await git.diff([
      "--name-only",
      `${baseBranch}..${currentBranch}`,
      `-- ${targetDirectory}`,
    ]);
    return diffFiles.split("\n").filter((file) => file.trim() !== "");
  } catch (error) {
    console.error("Virhe haarojen diffissä:", error);
    return [];
  }
}

main().catch((error) => {
  console.error("Error during analysis:", error);
});
