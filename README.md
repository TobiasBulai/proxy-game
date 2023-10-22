# Proxy Game
A fun and simple math game where you try and figure out which fields holds proximity to eachother and which does not.

The top row and outer left column shows a hint of number of fields that are in proximity of eachother. How do you play? Consider it alike minesweeper, but the hints are there from the beginning.
- By marking a field with `O` (single click), you describe it as one of the possible fields in proximity.
- By marking a field as `X` (double click), you describe it as not one of the fields in proximity.

Once you have your solution in place, mark the game done by using the function `solve()`.

### Styling
Feel free to use the css-file that this project contains or modify it to your own look and behavior.

### Initialization & configuration
```html
<div id="proxy-game"></div>
```

```javascript
// looks for the block with the id 'proxy-game' to build from
const game = new ProxyGame()

// configure matrix size. Default is 10x10
game.setMatrixSize(10)

// start the game and render
game.start()

// render the solution, unselected field will not be resolved
game.solve()
```
