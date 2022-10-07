export function getRandomProperty<T>(obj: T extends object ? T : never): keyof T {
    const keys = Object.keys(obj);

    return keys[Math.floor(Math.random() * keys.length)] as keyof T;
}