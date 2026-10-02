const fs = require("fs");
const path = require("path");
const mm = require("music-metadata");
const sharp = require("sharp");
const year = "2025"

const MUSIC_DIR = path.join(__dirname, "music-" + year);
const OUTPUT_FILE = path.join(__dirname, "music-" + year + ".json");
const ARTWORK_DIR = path.join(__dirname, "artwork-" + year);

const AUDIO_EXTENSIONS = new Set([
    ".mp3",
    ".flac",
    ".wav",
    ".m4a",
    ".ogg",
    ".opus",
    ".webm"
]);

async function getAudioFiles(directory) {
    const entries = await fs.promises.readdir(directory, {
        withFileTypes: true
    });

    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...await getAudioFiles(fullPath));
        } else if (
            AUDIO_EXTENSIONS.has(
                path.extname(entry.name).toLowerCase()
            )
        ) {
            files.push(fullPath);
        }
    }

    return files;
}

async function generateMusicJSON() {
    console.log("Scanning music folder...");

    await fs.promises.mkdir(ARTWORK_DIR, {
        recursive: true
    });

    const files = await getAudioFiles(MUSIC_DIR);
    const music = [];

    for (const filePath of files) {
        try {
            const relativeFile = path
                .relative(MUSIC_DIR, filePath)
                .replace(/\\/g, "/");

            console.log(`Reading: ${relativeFile}`);

            const metadata = await mm.parseFile(filePath);
            const common = metadata.common;

            const item = {
                title:
                    common.title ||
                    path.basename(filePath, path.extname(filePath)),

                artist: common.artist || "",

                album: common.album || "",

                file: relativeFile,

                picture: null
            };

            /*
             * Extract embedded album artwork
             */
            if (common.picture && common.picture.length > 0) {
                const picture = common.picture[0];

                /*
                 * Use the audio filename as the artwork filename.
                 *
                 * Example:
                 * song.mp3
                 * → artwork-2022/song.webp
                 */
                const artworkName =
                    path.basename(
                        filePath,
                        path.extname(filePath)
                    ) + ".webp";

                const artworkPath = path.join(
                    ARTWORK_DIR,
                    artworkName
                );

                console.log(`Extracting artwork: ${artworkName}`);

                await sharp(picture.data)
                    .webp({
                        quality: 85
                    })
                    .toFile(artworkPath);

                item.picture = `artwork-${year}/${artworkName}`;
            }

            music.push(item);

        } catch (error) {
            console.error(`Failed to read: ${filePath}`);
            console.error(error.message);
        }
    }

    await fs.promises.writeFile(
        OUTPUT_FILE,
        JSON.stringify(music, null, 2),
        "utf8"
    );

    console.log("");
    console.log(`Finished! ${music.length} music file(s) scanned.`);
    console.log(`Saved to: ${OUTPUT_FILE}`);
    console.log(`Artwork saved to: ${ARTWORK_DIR}`);
}

generateMusicJSON().catch(error => {
    console.error("Failed to generate music JSON:");
    console.error(error);
    process.exit(1);
});