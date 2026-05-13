export function getSongSEO(song) {
  return {
    title: `${song.title} - ${song.artist} MP3 Download | MediaVault`,
    description: `Download ${song.title} by ${song.artist} MP3 for free. ${song.quality || '128kbps'}, ${song.size || '3.5 MB'}. Free music downloads from Uganda.`,
    openGraph: {
      title: `${song.title} - ${song.artist}`,
      description: `Free MP3 download - ${song.size || '3.5 MB'}`,
      type: 'music.song',
    },
  };
}

export function getArtistSEO(artist) {
  return {
    title: `${artist.name} Songs MP3 Download | MediaVault`,
    description: `Download ${artist.name} songs for free. ${artist.songCount || 0} songs available. MP3 downloads.`,
  };
}

export function getGenreSEO(genre) {
  return {
    title: `${genre} Music MP3 Download | MediaVault`,
    description: `Download free ${genre} music. Latest ${genre} songs, MP3 downloads.`,
  };
}
