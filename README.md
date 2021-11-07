# Select Star SQL
This is the repository for [selectstarsql.com](https://selectstarsql.com). It is an interactive book that teaches SQL by conveying a mental model for writing queries.

## Development
The structure of the code is pretty standard for a Jekyll-built site. See [Jekyll Directory Structure](https://jekyllrb.com/docs/structure/).

All the pages are stored as markdown(.md) files in the top-level directory. Jekyll takes these markdown files and converts them into html files in `/_site`. During the conversion, it does all sorts of cool energy-saving things like embedding them in templates with standardized header and footer elements. These templates are stored in `/_layouts`.

You can serve a local version by running `jekyll serve`.

The main technical complexity lies in the interactive sql exercises. These are implemented as a custom html tag in `/scripts/main.js`. Firefox doesn't support custom html elements by default, so we pulled in the `custom-elements.min.js` library from unpkg. (See `_layouts/default.html`.)

## Contributing
To contribute, either email me directly at zichongkao@gmail.com, or submit a pull request by following these steps:
- Install [Jekyll](http://jekyllrb.com) and other project dependencies (`bundle install`)
- Fork this repo (button on the top right)
- Clone your forked repo `git clone https://github.com/MYUSERNAME/selectstarsql/`
- Make your changes
- Run `jekyll serve` and check your changes on your browser at your localhost address. This will probably be http://127.0.0.1.
- Commit your changes, and push it to your forked repo
- Click "Create Pull-request" when looking at your forked repo on Github.

## Licensing
The prose of the book is licensed by Zi Chong Kao under a <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons BY-SA 4.0 License</a> which allows sharing and adapting under the same license and with attribution. The code and datasets are released into the public domain under the <a href="https://creativecommons.org/publicdomain/zero/1.0/">Creative Commons CC0 License</a>.

## Todo
- Complete hiatus tutorial
- Clarify double quotes for SQLite
- Improve CASE WHEN explanation
