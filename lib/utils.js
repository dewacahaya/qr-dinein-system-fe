export const formatPrice = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value).replace('Rp', 'Rp ');
};

export const getImageUrl = (path) => {
    if (!path) {
        return 'https://placehold.co/300?text=No+Image';
    }
    if (path.startsWith('blob:') || path.startsWith('http')) return path;

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/img-proxy/${cleanPath}`;
};