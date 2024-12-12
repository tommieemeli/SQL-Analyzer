# SQL Analyzer

This Node.js script analyzes SQL migration files using OpenAI's GPT-4 model and sends the analysis to Microsoft Teams.

## Prerequisites

- Node.js installed
- OpenAI API key
- Microsoft Teams webhook URL

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd SQL-Analyzer
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration

1. Replace `your_openai_api_key` in `analyze-sql.js` with your actual OpenAI API key.
2. Replace `your_teams_webhook_url` in `analyze-sql.js` with your actual Microsoft Teams webhook URL.

## Usage

1. Place your SQL migration files in the `scripts` directory.
2. Run the script:
   ```sh
   node analyze-sql.js
   ```

## How It Works

1. The script reads all SQL files from the `scripts` directory.
2. For each file, it reads the content and sends it to OpenAI's GPT-4 model for analysis.
3. The analysis result is logged to the console.
4. Optionally, the analysis can be sent to a Microsoft Teams channel using a webhook.

## File Structure

SQL-Analyzer/ ├── analyze-sql.js ├── README.md └── scripts/ ├── 20241125_1820_ALTER_TABLE_Laskurivi_ADD_SubType.sql ├── 20241125_1820_ALTER_TABLE_MaksusuunnitelmaEraRivi_ADD_SubType.sql └── 20241126_1600_UPDATE_TuoteArvoLaji.sql

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
