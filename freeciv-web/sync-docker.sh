#!/bin/bash

echo "Run this script inside the docker container (Exec) in the freeciv-web directory, and it copy files from freeciv-web-shared (files in C:\ in Windows) to freeciv-web (inside Docker container). For local dev environment."
echo "Then run build.sh to rebuild.";

rsync -avz --update ../freeciv-web-shared/ ../freeciv-web

