cd src
zip -r ../build/function.zip *
cd -
aws --profile training lambda update-function-code \
  --function-name ryansApp \
  --zip-file fileb://build/function.zip  \
  --no-cli-pager
