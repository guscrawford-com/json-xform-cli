call yarn build
call yarn user-test ./example/example1.json --out ./example/example1-result.json --var=answer:41
call yarn user-test ./example/example2.json --out ./example/example2-result.json --var=something:Task
call yarn user-test ./example/example3.json --out ./example/example3-result.json