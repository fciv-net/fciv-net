#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null && pwd)"
cd "${DIR}"

. ./version.txt


  mkdir -p build

  ( cd build
    meson setup ../freeciv -Dserver='freeciv-web' -Dclients=[] -Dfcmp=cli \
          -Djson-protocol=true -Dnls=false -Daudio=false -Druledit=false \
          -Ddefault_library=static -Dprefix=${HOME}/freeciv \
          -Doptimization=3
    ninja
  )


echo "done"
