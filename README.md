# Serverless Todos

Quick project thrown together to accompany [my talk at SyntaxCon 2017](https://slides.com/ronakraithatha/serverless-framework/).

## Getting Started

- Install Serverless globally: `npm install -g serverless`
- Add `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY` and `AWS_REGION` to your environment variables
- Clone this project: `git clone https://github.com/RonakR/serverless-todos.git`
- Install dependencies: `npm install`
- Run locally using: `serverless offline start`
- Deploy to AWS: `serverless deploy`

## Releases
- [hello-world](https://github.com/RonakR/serverless-todos/releases/tag/hello-world): Simple `/hello` endpoint
- [todos](https://github.com/RonakR/serverless-todos/releases/tag/todos): Todo app with CRUD operation and DynamoDB storage
- [sns](https://github.com/RonakR/serverless-todos/releases/tag/sns): Cron job to count completed messages in given time and publish them using Simple Notification Service.