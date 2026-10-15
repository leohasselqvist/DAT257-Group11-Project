let currentUserId: number | null = null;
export function storeCurrentUserId(userId: number): void {
    currentUserId = userId;
}
export function getCurrentUserId(): number | null {
    return currentUserId;
}
export function clearCurrentUserId(): void {
    currentUserId = null;
}
