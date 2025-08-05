#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to find an available port starting from a preferred port
async function findAvailablePort(startPort = 5002) {
  let port = startPort;
  
  while (port < startPort + 100) { // Try up to 100 ports
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  
  throw new Error('No available ports found');
}

// Main function
async function startDev() {
  try {
    const port = await findAvailablePort(5002);
    console.log(`Starting Next.js dev server on port ${port}...`);
    
    const child = spawn('next', ['dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('error', (error) => {
      console.error('Failed to start dev server:', error);
      process.exit(1);
    });
    
    child.on('exit', (code) => {
      process.exit(code);
    });
    
  } catch (error) {
    console.error('Error finding available port:', error);
    process.exit(1);
  }
}

startDev();