/**properties and stuff
 * @class GameEnv
 * @property {Array} gameObjects - An array of game objects for the current level.
 * @property {Object} canvas - The canvas element.
 * @property {Object} ctx - The 2D rendering context of the canvas.
 * @property {number} innerWidth - The inner width of the game area.
 * @property {number} innerHeight - The inner height of the game area.
 * @property {number} top
 * add
 */

class GameEnv {
    static gameObjects = [];
    static canvas;
    static ctx;
    static innerWidth;
    static innerHeight;
    static top;
    static bottom;
}
    /**
     * Private constructor to prevent instantiation.
     * 
     * @constructor
     * @throws {Error} Throws an error if an attempt is made to instantiate the class.
     */
    constructor() {
        throw new Error('GameEnv is a static class and cannot be instantiated.');
    }
