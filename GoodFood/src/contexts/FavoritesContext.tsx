import React from "react";

type FavoritesContextType = {
  likedIds: number[];
  setLikedIds: React.Dispatch<React.SetStateAction<number[]>>;
}; /* innehåller favorit-IDn och funktion för att uppdatera dem */

export const FavoritesContext = React.createContext<FavoritesContextType | undefined>(undefined); /* Gör så flera sidor kan komma åt favoriterna */

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [likedIds, setLikedIds] = React.useState<number[]>([]); /*FavoritIdn ligger i likedIds och uppdateras med setfunktionen*/

    return (
        <FavoritesContext.Provider value={{ likedIds, setLikedIds }}> 
            {children}
        </FavoritesContext.Provider>
    );
} /* delar likedIds och setLikedIds med alla komponenter som ligger inom */