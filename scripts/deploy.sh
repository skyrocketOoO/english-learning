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
mkdir -p $PROJECT_DIR_NAME/prisma
cp prisma/dev.db $PROJECT_DIR_NAME/prisma/
cp prisma/schema.prisma $PROJECT_DIR_NAME/prisma/
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
ssh -i "~/.ssh/home.pem" $VM_USER@$VM_HOST << "ENDSSH"
rm -rf wordgame

tar -xzvf wordgame.tar.gz
rm wordgame.tar.gz

cd wordgame
pnpm install
pnpm add prisma @prisma/client
pnpm dlx prisma generate

sudo service wordgame restart
ENDSSH

# Clean up local tarball
rm $PROJECT_DIR_NAME.tar.gz

echo "deployment complete!"
