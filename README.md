# dirb-js

A [dirb](https://tools.kali.org/web-applications/dirb) made just with Javascript ❤

## Instalation

With NPM:
```sh
$ sudo npm install -g dirb-js
```
With Yarn:
```sh
$ sudo yarn global add dirb-js
```

## Usage

Options:

    -V, --version               output the version number
    -u, --url <url>             Base URL
    -r, --recursive             Set recursive mode
    -c, --concurrency <number>  Number of proccess at the same time. Default: 1
    -h, --help                  output usage information

## Example

```sh
$ dirb-js -u http://example.com -c 2 -r
```

# Help to improve this project!

### Todolist

* Implement Tests
* Set Wordlist file
* Improve requests that return 200 when the request is redirect

## License

MIT
