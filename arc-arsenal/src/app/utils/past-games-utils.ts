export function loadGames(localStorageItemName: string | null): any[] {
    if (!localStorageItemName) return [];
    const saved = localStorage.getItem(localStorageItemName);
    if (saved) {
        const data = JSON.parse(saved);
        return data.pastGames || [];
    }
    return [];
}

export function deletePastGame(localStorageItemName: string | null, index: number) {
    if (!localStorageItemName) return;
    const saved = localStorage.getItem(localStorageItemName);
    if (saved) {
        const data = JSON.parse(saved);
        if (data.pastGames && data.pastGames.length > index) {
            data.pastGames.splice(index, 1);
            localStorage.setItem(localStorageItemName, JSON.stringify(data));
        }
    }
}

export function saveCurrentGame(currentData: any, localStorageItemName: string | null) {
    if (!localStorageItemName) return;
    const saved = localStorage.getItem(localStorageItemName);
    let data;
    if (saved) {
        data = JSON.parse(saved);
        data.current = currentData;
    } else {
        data = { current: currentData };
    }
    localStorage.setItem(localStorageItemName, JSON.stringify(data));
}

export function addPastGame(pastGame: any, localStorageItemName: string | null) {
    if (!localStorageItemName) return;
    const saved = localStorage.getItem(localStorageItemName);
    let data
    if (!saved) {
        data = {
            pastGames: [],
            current: pastGame
        };
    }
    if (saved) {
        data = JSON.parse(saved);
        if (!data.pastGames) {
            data.pastGames = [];
        }
    }
    data.pastGames.push(pastGame);
    localStorage.setItem(localStorageItemName, JSON.stringify(data));
}

export function resetCurrentGame(localStorageItemName: string | null) {
    if (!localStorageItemName) return;
    const saved = localStorage.getItem(localStorageItemName);
    console.log("resetCurrentGame", localStorageItemName, saved);
    if (saved) {
        let data = JSON.parse(saved);
        data.current = null;
        localStorage.setItem(localStorageItemName, JSON.stringify(data));
    }
}