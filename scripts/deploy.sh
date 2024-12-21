#!/bin/bash

# Variables
VM_USER="ubuntu"
VM_HOST="ec2-3-106-200-208.ap-southeast-2.compute.amazonaws.com"
PROJECT_DIR_NAME="wordgame" # The directory name after cloning

# Build the project locally
rm -rf .next
pnpm install
if ! pnpm build; then
  echo "Build failed. Exiting..."
  exit 1
fi

# Create a tarball of the build and necessary files
mkdir -p $PROJECT_DIR_NAME
cp -r .next $PROJECT_DIR_NAME/
cp -r public $PROJECT_DIR_NAME/
cp next.config.mjs $PROJECT_DIR_NAME/
cp .env $PROJECT_DIR_NAME/
cp pnpm-lock.yaml $PROJECT_DIR_NAME/
cp package.json $PROJECT_DIR_NAME/
tar -czvf $PROJECT_DIR_NAME.tar.gz $PROJECT_DIR_NAME
rm -rf $PROJECT_DIR_NAME

ssh -i "~/.ssh/home.pem" $VM_USER@$VM_HOST << "ENDSSH"
sudo service $PROJECT_DIR_NAME stop
sudo rm -rf $PROJECT_DIR_NAME
ENDSSH

# Transfer the tarball to the VM
scp -i "~/.ssh/home.pem" $PROJECT_DIR_NAME.tar.gz $VM_USER@$VM_HOST:

# Connect to the VM and set up the project
# ssh -i "~/.ssh/home.pem" $VM_USER@$VM_HOST << "ENDSSH"

# tar -xzvf $PROJECT_DIR_NAME.tar.gz
# rm $PROJECT_DIR_NAME.tar.gz

# # Install dependencies
# cd $PROJECT_DIR_NAME
# pnpm install --prod

# # Start the application (optional: configure to run as a service)
# sudo service $PROJECT_DIR_NAME restart
# ENDSSH

# Clean up local tarball
rm $PROJECT_DIR_NAME.tar.gz

echo "deployment complete!"
