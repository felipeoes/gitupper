import { useState } from "react";
import { useTheme } from "styled-components";
import { AceEditorContainer, AceEditorButtonsContainer } from "./styles";
import { default as Editor } from "react-ace";

import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";

import { FaRedo } from "react-icons/fa";
import { MdOutlineCopyAll, MdCheckCircle } from "react-icons/md";

import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-code_lens";
import "ace-builds/src-noconflict/ext-elastic_tabstops_lite";
import "ace-builds/src-noconflict/ext-emmet";
import "ace-builds/src-noconflict/ext-error_marker";
import "ace-builds/src-noconflict/ext-hardwrap";
import "ace-builds/src-noconflict/ext-keybinding_menu";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-linking";
import "ace-builds/src-noconflict/ext-modelist";
import "ace-builds/src-noconflict/ext-options";
import "ace-builds/src-noconflict/ext-prompt";
import "ace-builds/src-noconflict/ext-rtl";
import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/ext-settings_menu";
import "ace-builds/src-noconflict/ext-spellcheck";
import "ace-builds/src-noconflict/ext-split";
import "ace-builds/src-noconflict/ext-static_highlight";
import "ace-builds/src-noconflict/ext-statusbar";
import "ace-builds/src-noconflict/ext-textarea";
import "ace-builds/src-noconflict/ext-themelist";
import "ace-builds/src-noconflict/ext-whitespace";
import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-sublime";
import "ace-builds/src-noconflict/keybinding-vim";
import "ace-builds/src-noconflict/keybinding-vscode";
import "ace-builds/src-noconflict/mode-abap";
import "ace-builds/src-noconflict/mode-abc";
import "ace-builds/src-noconflict/mode-actionscript";
import "ace-builds/src-noconflict/mode-ada";
import "ace-builds/src-noconflict/mode-alda";
import "ace-builds/src-noconflict/mode-apache_conf";
import "ace-builds/src-noconflict/mode-apex";
import "ace-builds/src-noconflict/mode-applescript";
import "ace-builds/src-noconflict/mode-aql";
import "ace-builds/src-noconflict/mode-asciidoc";
import "ace-builds/src-noconflict/mode-asl";
import "ace-builds/src-noconflict/mode-assembly_x86";
import "ace-builds/src-noconflict/mode-autohotkey";
import "ace-builds/src-noconflict/mode-batchfile";
import "ace-builds/src-noconflict/mode-c9search";
import "ace-builds/src-noconflict/mode-cirru";
import "ace-builds/src-noconflict/mode-clojure";
import "ace-builds/src-noconflict/mode-cobol";
import "ace-builds/src-noconflict/mode-coffee";
import "ace-builds/src-noconflict/mode-coldfusion";
import "ace-builds/src-noconflict/mode-crystal";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-csound_document";
import "ace-builds/src-noconflict/mode-csound_orchestra";
import "ace-builds/src-noconflict/mode-csound_score";
import "ace-builds/src-noconflict/mode-csp";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-curly";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-d";
import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/mode-diff";
import "ace-builds/src-noconflict/mode-django";
import "ace-builds/src-noconflict/mode-dockerfile";
import "ace-builds/src-noconflict/mode-dot";
import "ace-builds/src-noconflict/mode-drools";
import "ace-builds/src-noconflict/mode-edifact";
import "ace-builds/src-noconflict/mode-eiffel";
import "ace-builds/src-noconflict/mode-ejs";
import "ace-builds/src-noconflict/mode-elixir";
import "ace-builds/src-noconflict/mode-elm";
import "ace-builds/src-noconflict/mode-erlang";
import "ace-builds/src-noconflict/mode-forth";
import "ace-builds/src-noconflict/mode-fortran";
import "ace-builds/src-noconflict/mode-fsharp";
import "ace-builds/src-noconflict/mode-fsl";
import "ace-builds/src-noconflict/mode-ftl";
import "ace-builds/src-noconflict/mode-gcode";
import "ace-builds/src-noconflict/mode-gherkin";
import "ace-builds/src-noconflict/mode-gitignore";
import "ace-builds/src-noconflict/mode-glsl";
import "ace-builds/src-noconflict/mode-gobstones";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-graphqlschema";
import "ace-builds/src-noconflict/mode-groovy";
import "ace-builds/src-noconflict/mode-haml";
import "ace-builds/src-noconflict/mode-handlebars";
import "ace-builds/src-noconflict/mode-haskell";
import "ace-builds/src-noconflict/mode-haskell_cabal";
import "ace-builds/src-noconflict/mode-haxe";
import "ace-builds/src-noconflict/mode-hjson";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-html_elixir";
import "ace-builds/src-noconflict/mode-html_ruby";
import "ace-builds/src-noconflict/mode-ini";
import "ace-builds/src-noconflict/mode-io";
import "ace-builds/src-noconflict/mode-jack";
import "ace-builds/src-noconflict/mode-jade";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-json5";
import "ace-builds/src-noconflict/mode-jsoniq";
import "ace-builds/src-noconflict/mode-jsp";
import "ace-builds/src-noconflict/mode-jssm";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/mode-julia";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/mode-latte";
import "ace-builds/src-noconflict/mode-less";
import "ace-builds/src-noconflict/mode-liquid";
import "ace-builds/src-noconflict/mode-lisp";
import "ace-builds/src-noconflict/mode-livescript";
import "ace-builds/src-noconflict/mode-logiql";
import "ace-builds/src-noconflict/mode-logtalk";
import "ace-builds/src-noconflict/mode-lsl";
import "ace-builds/src-noconflict/mode-lua";
import "ace-builds/src-noconflict/mode-luapage";
import "ace-builds/src-noconflict/mode-lucene";
import "ace-builds/src-noconflict/mode-makefile";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-mask";
import "ace-builds/src-noconflict/mode-matlab";
import "ace-builds/src-noconflict/mode-maze";
import "ace-builds/src-noconflict/mode-mediawiki";
import "ace-builds/src-noconflict/mode-mel";
import "ace-builds/src-noconflict/mode-mips";
import "ace-builds/src-noconflict/mode-mixal";
import "ace-builds/src-noconflict/mode-mushcode";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-nginx";
import "ace-builds/src-noconflict/mode-nim";
import "ace-builds/src-noconflict/mode-nix";
import "ace-builds/src-noconflict/mode-nsis";
import "ace-builds/src-noconflict/mode-nunjucks";
import "ace-builds/src-noconflict/mode-objectivec";
import "ace-builds/src-noconflict/mode-ocaml";
import "ace-builds/src-noconflict/mode-pascal";
import "ace-builds/src-noconflict/mode-perl";
import "ace-builds/src-noconflict/mode-pgsql";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-php_laravel_blade";
import "ace-builds/src-noconflict/mode-pig";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/mode-powershell";
import "ace-builds/src-noconflict/mode-praat";
import "ace-builds/src-noconflict/mode-prisma";
import "ace-builds/src-noconflict/mode-prolog";
import "ace-builds/src-noconflict/mode-properties";
import "ace-builds/src-noconflict/mode-protobuf";
import "ace-builds/src-noconflict/mode-puppet";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-qml";
import "ace-builds/src-noconflict/mode-r";
import "ace-builds/src-noconflict/mode-raku";
import "ace-builds/src-noconflict/mode-razor";
import "ace-builds/src-noconflict/mode-rdoc";
import "ace-builds/src-noconflict/mode-red";
import "ace-builds/src-noconflict/mode-redshift";
import "ace-builds/src-noconflict/mode-rhtml";
import "ace-builds/src-noconflict/mode-rst";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/mode-scad";
import "ace-builds/src-noconflict/mode-scala";
import "ace-builds/src-noconflict/mode-scheme";
import "ace-builds/src-noconflict/mode-scrypt";
import "ace-builds/src-noconflict/mode-scss";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-sjs";
import "ace-builds/src-noconflict/mode-slim";
import "ace-builds/src-noconflict/mode-smarty";
import "ace-builds/src-noconflict/mode-smithy";
import "ace-builds/src-noconflict/mode-snippets";
import "ace-builds/src-noconflict/mode-soy_template";
import "ace-builds/src-noconflict/mode-space";
import "ace-builds/src-noconflict/mode-sparql";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-sqlserver";
import "ace-builds/src-noconflict/mode-stylus";
import "ace-builds/src-noconflict/mode-svg";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-tcl";
import "ace-builds/src-noconflict/mode-terraform";
import "ace-builds/src-noconflict/mode-tex";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-textile";
import "ace-builds/src-noconflict/mode-toml";
import "ace-builds/src-noconflict/mode-tsx";
import "ace-builds/src-noconflict/mode-turtle";
import "ace-builds/src-noconflict/mode-twig";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-vala";
import "ace-builds/src-noconflict/mode-vbscript";
import "ace-builds/src-noconflict/mode-velocity";
import "ace-builds/src-noconflict/mode-verilog";
import "ace-builds/src-noconflict/mode-vhdl";
import "ace-builds/src-noconflict/mode-visualforce";
import "ace-builds/src-noconflict/mode-wollok";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-xquery";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-zeek";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-clouds";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-crimson_editor";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-dreamweaver";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-gob";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-idle_fingers";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/theme-katzenmilch";
import "ace-builds/src-noconflict/theme-kr_theme";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-merbivore";
import "ace-builds/src-noconflict/theme-merbivore_soft";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-mono_industrial";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-sqlserver";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow_night_blue";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/snippets/abap";
import "ace-builds/src-noconflict/snippets/abc";
import "ace-builds/src-noconflict/snippets/actionscript";
import "ace-builds/src-noconflict/snippets/ada";
import "ace-builds/src-noconflict/snippets/alda";
import "ace-builds/src-noconflict/snippets/apache_conf";
import "ace-builds/src-noconflict/snippets/apex";
import "ace-builds/src-noconflict/snippets/applescript";
import "ace-builds/src-noconflict/snippets/aql";
import "ace-builds/src-noconflict/snippets/asciidoc";
import "ace-builds/src-noconflict/snippets/asl";
import "ace-builds/src-noconflict/snippets/assembly_x86";
import "ace-builds/src-noconflict/snippets/autohotkey";
import "ace-builds/src-noconflict/snippets/batchfile";
import "ace-builds/src-noconflict/snippets/c9search";
import "ace-builds/src-noconflict/snippets/cirru";
import "ace-builds/src-noconflict/snippets/clojure";
import "ace-builds/src-noconflict/snippets/cobol";
import "ace-builds/src-noconflict/snippets/coffee";
import "ace-builds/src-noconflict/snippets/coldfusion";
import "ace-builds/src-noconflict/snippets/crystal";
import "ace-builds/src-noconflict/snippets/csharp";
import "ace-builds/src-noconflict/snippets/csound_document";
import "ace-builds/src-noconflict/snippets/csound_orchestra";
import "ace-builds/src-noconflict/snippets/csound_score";
import "ace-builds/src-noconflict/snippets/csp";
import "ace-builds/src-noconflict/snippets/css";
import "ace-builds/src-noconflict/snippets/curly";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/d";
import "ace-builds/src-noconflict/snippets/dart";
import "ace-builds/src-noconflict/snippets/diff";
import "ace-builds/src-noconflict/snippets/django";
import "ace-builds/src-noconflict/snippets/dockerfile";
import "ace-builds/src-noconflict/snippets/dot";
import "ace-builds/src-noconflict/snippets/drools";
import "ace-builds/src-noconflict/snippets/edifact";
import "ace-builds/src-noconflict/snippets/eiffel";
import "ace-builds/src-noconflict/snippets/ejs";
import "ace-builds/src-noconflict/snippets/elixir";
import "ace-builds/src-noconflict/snippets/elm";
import "ace-builds/src-noconflict/snippets/erlang";
import "ace-builds/src-noconflict/snippets/forth";
import "ace-builds/src-noconflict/snippets/fortran";
import "ace-builds/src-noconflict/snippets/fsharp";
import "ace-builds/src-noconflict/snippets/fsl";
import "ace-builds/src-noconflict/snippets/ftl";
import "ace-builds/src-noconflict/snippets/gcode";
import "ace-builds/src-noconflict/snippets/gherkin";
import "ace-builds/src-noconflict/snippets/gitignore";
import "ace-builds/src-noconflict/snippets/glsl";
import "ace-builds/src-noconflict/snippets/gobstones";
import "ace-builds/src-noconflict/snippets/golang";
import "ace-builds/src-noconflict/snippets/graphqlschema";
import "ace-builds/src-noconflict/snippets/groovy";
import "ace-builds/src-noconflict/snippets/haml";
import "ace-builds/src-noconflict/snippets/handlebars";
import "ace-builds/src-noconflict/snippets/haskell";
import "ace-builds/src-noconflict/snippets/haskell_cabal";
import "ace-builds/src-noconflict/snippets/haxe";
import "ace-builds/src-noconflict/snippets/hjson";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/snippets/html_elixir";
import "ace-builds/src-noconflict/snippets/html_ruby";
import "ace-builds/src-noconflict/snippets/ini";
import "ace-builds/src-noconflict/snippets/io";
import "ace-builds/src-noconflict/snippets/jack";
import "ace-builds/src-noconflict/snippets/jade";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/json";
import "ace-builds/src-noconflict/snippets/json5";
import "ace-builds/src-noconflict/snippets/jsoniq";
import "ace-builds/src-noconflict/snippets/jsp";
import "ace-builds/src-noconflict/snippets/jssm";
import "ace-builds/src-noconflict/snippets/jsx";
import "ace-builds/src-noconflict/snippets/julia";
import "ace-builds/src-noconflict/snippets/kotlin";
import "ace-builds/src-noconflict/snippets/latex";
import "ace-builds/src-noconflict/snippets/latte";
import "ace-builds/src-noconflict/snippets/less";
import "ace-builds/src-noconflict/snippets/liquid";
import "ace-builds/src-noconflict/snippets/lisp";
import "ace-builds/src-noconflict/snippets/livescript";
import "ace-builds/src-noconflict/snippets/logiql";
import "ace-builds/src-noconflict/snippets/logtalk";
import "ace-builds/src-noconflict/snippets/lsl";
import "ace-builds/src-noconflict/snippets/lua";
import "ace-builds/src-noconflict/snippets/luapage";
import "ace-builds/src-noconflict/snippets/lucene";
import "ace-builds/src-noconflict/snippets/makefile";
import "ace-builds/src-noconflict/snippets/markdown";
import "ace-builds/src-noconflict/snippets/mask";
import "ace-builds/src-noconflict/snippets/matlab";
import "ace-builds/src-noconflict/snippets/maze";
import "ace-builds/src-noconflict/snippets/mediawiki";
import "ace-builds/src-noconflict/snippets/mel";
import "ace-builds/src-noconflict/snippets/mips";
import "ace-builds/src-noconflict/snippets/mixal";
import "ace-builds/src-noconflict/snippets/mushcode";
import "ace-builds/src-noconflict/snippets/mysql";
import "ace-builds/src-noconflict/snippets/nginx";
import "ace-builds/src-noconflict/snippets/nim";
import "ace-builds/src-noconflict/snippets/nix";
import "ace-builds/src-noconflict/snippets/nsis";
import "ace-builds/src-noconflict/snippets/nunjucks";
import "ace-builds/src-noconflict/snippets/objectivec";
import "ace-builds/src-noconflict/snippets/ocaml";
import "ace-builds/src-noconflict/snippets/pascal";
import "ace-builds/src-noconflict/snippets/perl";
import "ace-builds/src-noconflict/snippets/pgsql";
import "ace-builds/src-noconflict/snippets/php";
import "ace-builds/src-noconflict/snippets/php_laravel_blade";
import "ace-builds/src-noconflict/snippets/pig";
import "ace-builds/src-noconflict/snippets/plain_text";
import "ace-builds/src-noconflict/snippets/powershell";
import "ace-builds/src-noconflict/snippets/praat";
import "ace-builds/src-noconflict/snippets/prisma";
import "ace-builds/src-noconflict/snippets/prolog";
import "ace-builds/src-noconflict/snippets/properties";
import "ace-builds/src-noconflict/snippets/protobuf";
import "ace-builds/src-noconflict/snippets/puppet";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/qml";
import "ace-builds/src-noconflict/snippets/r";
import "ace-builds/src-noconflict/snippets/raku";
import "ace-builds/src-noconflict/snippets/razor";
import "ace-builds/src-noconflict/snippets/rdoc";
import "ace-builds/src-noconflict/snippets/red";
import "ace-builds/src-noconflict/snippets/redshift";
import "ace-builds/src-noconflict/snippets/rhtml";
import "ace-builds/src-noconflict/snippets/rst";
import "ace-builds/src-noconflict/snippets/ruby";
import "ace-builds/src-noconflict/snippets/rust";
import "ace-builds/src-noconflict/snippets/sass";
import "ace-builds/src-noconflict/snippets/scad";
import "ace-builds/src-noconflict/snippets/scala";
import "ace-builds/src-noconflict/snippets/scheme";
import "ace-builds/src-noconflict/snippets/scrypt";
import "ace-builds/src-noconflict/snippets/scss";
import "ace-builds/src-noconflict/snippets/sh";
import "ace-builds/src-noconflict/snippets/sjs";
import "ace-builds/src-noconflict/snippets/slim";
import "ace-builds/src-noconflict/snippets/smarty";
import "ace-builds/src-noconflict/snippets/smithy";
import "ace-builds/src-noconflict/snippets/snippets";
import "ace-builds/src-noconflict/snippets/soy_template";
import "ace-builds/src-noconflict/snippets/space";
import "ace-builds/src-noconflict/snippets/sparql";
import "ace-builds/src-noconflict/snippets/sql";
import "ace-builds/src-noconflict/snippets/sqlserver";
import "ace-builds/src-noconflict/snippets/stylus";
import "ace-builds/src-noconflict/snippets/svg";
import "ace-builds/src-noconflict/snippets/swift";
import "ace-builds/src-noconflict/snippets/tcl";
import "ace-builds/src-noconflict/snippets/terraform";
import "ace-builds/src-noconflict/snippets/tex";
import "ace-builds/src-noconflict/snippets/text";
import "ace-builds/src-noconflict/snippets/textile";
import "ace-builds/src-noconflict/snippets/toml";
import "ace-builds/src-noconflict/snippets/tsx";
import "ace-builds/src-noconflict/snippets/turtle";
import "ace-builds/src-noconflict/snippets/twig";
import "ace-builds/src-noconflict/snippets/typescript";
import "ace-builds/src-noconflict/snippets/vala";
import "ace-builds/src-noconflict/snippets/vbscript";
import "ace-builds/src-noconflict/snippets/velocity";
import "ace-builds/src-noconflict/snippets/verilog";
import "ace-builds/src-noconflict/snippets/vhdl";
import "ace-builds/src-noconflict/snippets/visualforce";
import "ace-builds/src-noconflict/snippets/wollok";
import "ace-builds/src-noconflict/snippets/xml";
import "ace-builds/src-noconflict/snippets/xquery";
import "ace-builds/src-noconflict/snippets/yaml";
import "ace-builds/src-noconflict/snippets/zeek";

export default function AceEditor(props) {
  const { row, value, onChange, handleOnCopySrcCode, handleOnClickOriginal } =
    props;
  const theme = useTheme();
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleCloseTooltip = () => {
    setOpenTooltip(false);
  };

  const handleOpenTooltip = () => {
    setOpenTooltip(true);
  };

  function handleCopySrcCode() {
    handleOnCopySrcCode();
    handleOpenTooltip();

    setTimeout(() => {
      handleCloseTooltip();
    }, 3000);
  }

  function uncapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  function formatProgLanguage(progLanguage) {
    const formattedProgLanguage = uncapitalize(progLanguage);
    return formattedProgLanguage.includes("c++")
      ? "c_cpp"
      : formattedProgLanguage.includes("c#")
      ? "csharp"
      : uncapitalize(progLanguage.replace(/[^A-Za-z]+/g, ""));
  }

  const actions = [
    {
      icon: openTooltip ? (
        <MdCheckCircle size={30} color="green" />
      ) : (
        <MdOutlineCopyAll size={26} color="black" />
      ),
      name: openTooltip ? "Código copiado!" : "Copiar",
      onClick: handleCopySrcCode,
    },
    {
      icon: <FaRedo size={20} color="black" />,
      name: "Voltar para o código-fonte original",
      onClick: handleOnClickOriginal,
    },
  ];

  return (
    <AceEditorContainer>
      <Editor
        mode={formatProgLanguage(row.prog_language)}
        theme="textmate"
        onChange={onChange}
        name="ace_div"
        value={value}
        fontSize={14}
        showPrintMargin
        editorProps={{ $blockScrolling: true }}
        enableBasicAutocompletion
        enableLiveAutocompletion
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{
          height: "352px",
          minWidth: "100%",
          margin: 0,
          padding: 0,
          zIndex: 10,
        }}
      />

      <AceEditorButtonsContainer>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{
            marginTop: -28,
            marginRight: 2,
            ".MuiSpeedDial-fab": {
              backgroundColor: theme.colors.primary,
            },
          }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      </AceEditorButtonsContainer>
    </AceEditorContainer>
  );
}
