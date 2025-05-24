#!/bin/bash
# make sure emcc is in your PATH, e.g. source ~/dev/tools/emsdk/emsdk_env.sh
emcc native/ed25519/additions/*.c \
     native/curve25519-donna.c \
     native/ed25519/*.c \
     native/ed25519/sha512/sha2big.c \
     -Inative/ed25519/nacl_includes \
     -Inative/ed25519 \
     -Inative/ed25519/sha512 \
     -O1 -flto -msimd128 \
     -s WASM=1 \
     -s WASM_ASYNC_COMPILATION=0 \
     -s MODULARIZE=1 \
     -s ENVIRONMENT=node \
     -s SINGLE_FILE=0 \
     -s NO_EXIT_RUNTIME=1 \
     -s NO_FILESYSTEM=1 \
     -s USE_CLOSURE_COMPILER=1 \
     -s EXPORTED_FUNCTIONS="['_curve25519_donna','_curve25519_sign','_curve25519_verify','_malloc','_free']" \
     -s EXPORTED_RUNTIME_METHODS="['HEAPU8']" \
     -o src/built/curveasm.js
