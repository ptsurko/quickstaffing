# Quick Staffing

## Installing and running
1. Install nodejs
2. Install dependencies with `npm install` and `bower install`
3. Create `.credentials` file in root folder of the project and add your epam username and password on separate lines.
4. Run with `gulp`
5. Project uses [EditorConfig](http://editorconfig.org) so you you have to install appropriate plugin for your IDEs (or text editor).
6. API methods:
   1. /api/init - initializes cache
   2. /api/reset - resets filesystem and in-memory cache
   3. /api/positions
   4. /api/positions?name=GOOG - searches positions by project name (startWith)
   5. /api/positions/789629ec-07ee-4011-b814-f8860744153f
   6. /api/positions/789629ec-07ee-4011-b814-f8860744153f/candidates?primarySkill=4&city=1
   7. /api/candidates
   8. /api/candidates?name=Pave - searches candidates by full name (startWith)
   9. /api/candidates/a1a3bc1e-1d18-4401-92f8-d2f22e8d7527
  10. /api/candidates/a1a3bc1e-1d18-4401-92f8-d2f22e8d7527/positions?primarySkill=10&city=5
  11. /api/candidates/photo/dbd0e119-4155-43a6-aeda-dcae0f094696
7. Ranking parameters 0..10:
  1. primarySkill
  2. city
  3. country
  4. position
