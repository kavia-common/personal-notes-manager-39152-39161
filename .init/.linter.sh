#!/bin/bash
cd /home/kavia/workspace/code-generation/personal-notes-manager-39152-39161/notes_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

