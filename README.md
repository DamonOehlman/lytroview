# lytroview

This was (and continues to be when I get time) of unpacking the raw `.LFP` file format in a meaningful way. This current implementation is very limited (i.e. can only print metadata from the file).  I am looking at how to decode the RAW image data into something meaningful, however, that is quite a bit more complicated.

[![NPM](https://nodei.co/npm/lytroview.png)](https://nodei.co/npm/lytroview/)

[![bitHound Score](https://www.bithound.io/github/DamonOehlman/lytroview/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/lytroview)

## Usage

Install using `npm`:

```
npm install -g lytroview
```

Then you can run `lytroview --help` to see the available list of commands (noting that `unpack` is not operational at this time).

```
$ lytroview --help

  Usage: lytroview [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    unpack [options] <filename>  unpack the target LFP file into image files for each layer
    describe <filename>          show the metadata contained in the LFP file
```

## LICENSE

Copyright (c) 2017 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

