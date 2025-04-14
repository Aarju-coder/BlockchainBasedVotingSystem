// create-space.ts
import * as W3UpClient from '@web3-storage/w3up-client';
import fs from 'fs';

const run = async () => {
  // 1. Create a new client + agent
  const client = await W3UpClient.create();

  // 2. Generate a new agent identity (will be authorized by default)
  const agent = client.agent;

  // 3. Create a new space
  const space = await client.spaces.create('Voting DApp Space');

  // 4. Set it as current space
  await client.setCurrentSpace(space);

  // 5. Output Space DID
  console.log('✅ Space created!');
  console.log('🆔 Space DID:', space.did());

  // 6. Export agent identity (save agent.json for reuse in uploads)
  const agentData = await agent.export();
  fs.writeFileSync('agent.json', JSON.stringify(agentData, null, 2));
  console.log('🔐 Agent identity exported to agent.json');
};

run().catch((err) => {
  console.error('❌ Error creating space:', err);
});
