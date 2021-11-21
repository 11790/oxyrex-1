/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');

const epicenter = (function() {
    class Counter {
        constructor(size) {
            this.size = size;
            this.clear();
        }
        count(index, direct = false) {
            if (!direct) {
                index = -index - 1;
            }
            this.data[this.data.findIndex(entry => entry.index === index)].count ++;
        }
        clear() {
            this.data = [];
            for (let i = 0; i < this.size; i ++) {
                this.data.push({
                    index: i,
                    count: 0
                });
            }
        }
        getWinner(returnCount = false) {
            this.data = this.data.sort(function(a, b) {
                return b.count - a.count;
            });
            if (this.data.length > 1 && this.data[0].count === this.data[1].count) { // Tie
                return 0;
            }
            if (returnCount) {
                return this.data[0].count;
            }
            return this.data[0].index + 1;
        }
    }
    const rings = room["dom0"].map(function(loc) {
        return {
            locationData: loc,
            control: 0,
            name: "dom0"
        }
    });
    const scoreboard = new Counter(c.TEAMS);
    const contestants = new Counter(c.TEAMS);
    function countRing(ring) {
        contestants.clear();
        for (let i = 0; i < entities.length; i ++) {
            if (entities[i].isPlayer || entities[i].isBot) {
                if (room.isIn(ring.name, entities[i])) {
                    contestants.count(entities[i].team);
                }
            }
        }
        const winner = contestants.getWinner();
        const old = ring.control;
        ring.control = winner;
        if (old !== ring.control) {
            ring.name = `dom${ring.control}`;
            room.setType(`dom${ring.control}`, ring.locationData);
        }
        return ring;
    }
    function update() {
        rings.forEach(countRing);
        rings.forEach(function(ring) {
            if (ring.control !== 0) {
                scoreboard.count(ring.control - 1, true);
            }
        });
        const leaderCount = scoreboard.getWinner(true);
        if (leaderCount != null) {
            if (leaderCount === 100) {
                const winnerID = scoreboard.getWinner();
                sockets.broadcast(winnerID + " has won!");
            }
        }
    }
    function getScoreboard() {
        return scoreboard.data;
    }
    return {
        update,
        rings,
        getScoreboard
    }
})();

module.exports = {
    epicenter
};