# Select Star SQL
This is the repository for [selectstarsql.com](https://selectstarsql.com). It is an interactive book that teaches SQL by conveying a mental model for writing queries.

## Development
The structure of the code is pretty standard for a Jekyll-built site. See [Jekyll Directory Structure](https://jekyllrb.com/docs/structure/).

All the pages are stored as markdown(.md) files in the top-level directory. Jekyll takes these markdown files and converts them into html files in `/_site`. During the conversion, it does all sorts of cool energy-saving things like embedding them in templates with standardized header and footer elements. These templates are stored in `/_layouts`.

The main technical complexity lies in the interactive sql exercises. These are implemented as a custom html tag in `/scripts/main.js`. Firefox doesn't support custom html elements by default, so we pulled in the `custom-elements.min.js` library from unpkg. (See `_layouts/default.html`.)

To contribute, either email me directly at zichongkao@gmail.com, or submit a pull request by following these steps:
- Install [Jekyll](http://jekyllrb.com)
- Fork this repo (button on the top right)
- Clone your forked repo `git clone https://github.com/MYUSERNAME/selectstarsql/`
- Make your changes
- Run `jekyll serve` and check your changes on your browser at your localhost address. This will probably be http://127.0.0.1.
- Commit your changes, and push it to your forked repo
- Click "Create Pull-request" when looking at your forked repo on Github.

## Todo
- Complete hiatus tutorial
- Clarify double quotes for SQLite
- Improve CASE WHEN explanation
