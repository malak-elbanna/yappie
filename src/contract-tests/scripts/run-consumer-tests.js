const { execSync } = require('child_process');

console.log('Running consumer contract tests...');
execSync('jest src/contract-tests/consumers/ --config=./jest.contracts.config.js', { stdio: 'inherit' });