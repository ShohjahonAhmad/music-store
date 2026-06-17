export default async function getSongs( page: number, seed: bigint, likes: number, locale: string) {
    try {
        const response = await fetch(`http://localhost:8082/songs?page=${page}&seed=${seed}&likes=${likes}&locale=${locale}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch(err:any) {
        throw new Error(`Failed to fetch songs: ${err.message}`);
    }
}