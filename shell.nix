let
  pkgs = import <nixpkgs> {
    config = { };
    overlays = [ ];
  };
in

pkgs.mkShellNoCC {
  packages = with pkgs; [
    nodejs
    corepack
    typescript-language-server

    nrr
    wrangler
  ];
}
