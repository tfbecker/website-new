{ pkgs ? import <nixpkgs> {} }:

let
  app = pkgs.stdenv.mkDerivation {
    pname = "my-app";
    version = "0.1.0";
    src = ./.;
    buildInputs = [ pkgs.nodejs-20_x ];
    # Build phase: install dependencies (using legacy-peer-deps) and build the app
    buildPhase = ''
      npm install --legacy-peer-deps
      npm run build
    '';
    # Install phase: copy all files to the output directory
    installPhase = ''
      mkdir -p $out
      cp -r * $out
    '';
  };
in

pkgs.dockerTools.buildImage {
  name = "my-app";
  tag = "latest";
  # Copy files from the built app into the Docker image root
  copyToRoot = true;
  contents = [ app ];
  config = {
    # Use npm start to run the production server
    Cmd = [ "npm" "start" ];
    WorkingDir = "/";
    Env = [ "NODE_ENV=production" ];
  };
} 