

## Example usecases

```
# Transform single JSON document
echo '[1, 2]' |\
	npipe 'in => in.map(n => n*2)'
# stdout: [2, 4]

# Transform multiple JSON documents separated by newlines
echo -e '[1, 2]\n[2, 4]' |\
	npipe in => in.map(n => n*3)'
# stdout: [3, 6]\n[6, 12]

# Accept input from file(s):
npipe 'in => in.map(n => n*3)' {a,b}.json

# Parse CSV instead of JSON
echo -e 'Col A,Col B\n1,2\n3,4' |\
	npipe -i csv 'rows => [rows[0], ...rows.slice(1).map(([a, b]) => [b, a])]'
# stdout: Col A,Col B\n2,1\n4,3

# Use different in and out formats
echo -e 'Col A,Col B\n1,2\n3,4' |\
	npipe -i csv -o json 'rows => rows.slice(1).map(([a, b]) => ({a, b}))'
# stdout: [{1, 2}, {2, 3}]

# Specify requires as arguments. Dependencies are automatically installed and cached
# If you need anything other than the default export you still can do require('module/file') as usual.
echo '[1509119624829, 1478015721777, 1478015721777]' |\
	npipe -r moment -r lodash:3 -o plain 'in => lodash.uniq(in).map(ts => moment(ts).format()).join("\n")'



```
