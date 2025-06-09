import { Injectable } from '@angular/core';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { db } from '../../main';

@Injectable({ providedIn: 'root' })
export class GameStorageService {

  constructor(private auth: AuthService) { }

  private get isConnected() {
    return !!this.auth.user;
  }

  async addOrUpadtePastGame(pastGame: any, gameName: string) {
    if (this.isConnected) {
      const gameRef = doc(db, `users/${this.auth.user!.uid}/games/${gameName}`);
      await getDoc(gameRef).then(async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          let pastGames = data['pastGames'] || [];
          // Check if the game already exists in pastGames
          const existingGameIndex = pastGames.findIndex((g: any) => g.id === pastGame.id);
          if (existingGameIndex !== -1) {
            // Update the existing game
            pastGames[existingGameIndex] = pastGame;
          } else {
            // Add the new game
            pastGames.push(pastGame);
          }
          await updateDoc(gameRef, {
            pastGames: pastGames
          });
        }
      });
    } else {
      if (!gameName) return;
      const saved = localStorage.getItem(gameName);
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
      localStorage.setItem(gameName, JSON.stringify(data));
    }
  }

  async deletePastGame(gameId: string, gameName: string) {
    if (this.isConnected) {
      const gameRef = doc(db, `users/${this.auth.user!.uid}/games/${gameName}`);
      let docSnap = await getDoc(gameRef);
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      let pastGames = data['pastGames'] || [];
      const updatedPastGames = pastGames.filter((g: any) => g.id !== gameId);
      await updateDoc(gameRef, {
        pastGames: updatedPastGames
      });
    } else {
      if (!gameName) return;
      const saved = localStorage.getItem(gameName);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.pastGames && data.pastGames.length > 0) {
          data.pastGames = data.pastGames.filter((g: any) => g.id !== gameId);
          localStorage.setItem(gameName, JSON.stringify(data));
        }
      }
    }
  }

  async saveCurrentGame(currentGame: any, gameName: string) {
    if (this.isConnected) {
      const gameRef = doc(db, `users/${this.auth.user!.uid}/games/${gameName}`);
      await getDoc(gameRef).then(async (docSnap) => {
        if (!docSnap.exists()) {
          await setDoc(gameRef, { current: currentGame, pastGames: [] });
        } else {
          await updateDoc(gameRef, { current: currentGame });
        }
      }).catch(e => {
        console.error('Error saving current game:', e);
      });
      // Update the current game in the document
    } else {
      if (!gameName) return;
      const saved = localStorage.getItem(gameName);
      let data;
      if (saved) {
        data = JSON.parse(saved);
        data.current = currentGame;
      } else {
        data = { current: currentGame };
      }
      localStorage.setItem(gameName, JSON.stringify(data));

    }
  }

  async loadPastGames(gameName: string) {
    if (this.isConnected) {
      try {
        const docSnap = await getDoc(doc(db, `users/${this.auth.user!.uid}/games/${gameName}`));
        if (!docSnap.exists()) return [];
        return docSnap.data()['pastGames'];
      } catch (e) {
        console.error('Error loading past games:', e);
        return [];
      }
    } else {
      if (!gameName) return [];
      const saved = localStorage.getItem(gameName);
      if (saved) {
        const data = JSON.parse(saved);
        return data.pastGames || [];
      }
      return [];
    }
  }

  async loadCurrentGame(gameName: string) {
    if (this.isConnected) {
      const gameRef = doc(db, `users/${this.auth.user!.uid}/games/${gameName}`);
      try {
        const docSnap = await getDoc(gameRef);
        if (docSnap.exists()) {
          return docSnap.data()['current'];
        }
      } catch (e) {
        console.error('Error loading current game:', e);
      }
      return null;
    } else {
      if (!gameName) return null;
      const saved = localStorage.getItem(gameName);
      if (saved) {
        const data = JSON.parse(saved);
        return data.current || null;
      }
      return null;
    }
  }

  async resetCurrentGame(gameName: string) {
    if (this.isConnected) {
      const gameRef = doc(db, `users/${this.auth.user!.uid}/games/${gameName}`);
      await updateDoc(gameRef, { current: null });
    } else {
      if (!gameName) return;
      const saved = localStorage.getItem(gameName);
      if (saved) {
        let data = JSON.parse(saved);
        data.current = null;
        localStorage.setItem(gameName, JSON.stringify(data));
      }
    }
  }
}
