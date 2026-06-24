export default async function getExport(seed: bigint, locale: string, page: number) {
    try {
        const response = await fetch(`https://music-store-backend-rho.vercel.app/songs/export?seed=${seed}&locale=${locale}&page=${page}`);

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.blob();
    } catch(err:any) {
        throw new Error(`Failed to fetch export: ${err.message}`);
    }
}