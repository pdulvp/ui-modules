Get-ChildItem -Directory -Filter * |
    ForEach-Object {
	  cd $_.FullName
	  npm publish
	  cd ..
    }