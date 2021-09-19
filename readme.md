# IS212-LMS-Back
## Setting up environment
This repository requires you to have docker and hasura-cli installed.  
You can proceed to this link to get your environment up and running [with this link](https://hasura.io/docs/latest/graphql/core/getting-started/docker-simple.html#step-2-run-hasura-graphql-engine).

## Running development server
As we have disabled the defautl console for hasura to allow migrations. We require a change of strategy to run the backend to opt-in for migrations whenever we change the schemas or permissions. This is so that we can track the changes without this git repository itself.  

### Running the application
Access the `hasura-migrations` folder
```sh
# Access the migrations foler
cd hasura-migrations

# Use hasura-cli to enable migrations auto-magically
hasura console
```
