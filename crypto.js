function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

function sfc32(a, b, c, d) {
    return function() {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21 | c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    }
}

function shuffle(array, rand) {
    let m = array.length;
    while (m) {
        const i = Math.floor(rand() * m--);
        [array[m], array[i]] = [array[i], array[m]];
    }
    return array;
}

function assignPrompts(totalPrompts, totalPlayers, playerNumber, seedStr) {
    if (playerNumber < 1 || playerNumber > totalPlayers) {
        throw new Error("Invalid player number.");
    }
    const seedFn = xmur3(seedStr);
    const rand = sfc32(seedFn(), seedFn(), seedFn(), seedFn());
    const ids = shuffle(Array.from({length: totalPrompts}, (_, i) => i), rand);
    const baseSize = Math.floor(totalPrompts / totalPlayers);
    const remainder = totalPrompts % totalPlayers;
    const offset = (playerNumber - 1) * baseSize + Math.min(playerNumber - 1, remainder);
    const size = baseSize + (playerNumber <= remainder ? 1 : 0);
    return ids.slice(offset, offset + size);
}