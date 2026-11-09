const BUCKET = 'read_it';

export const getStoragePath = (publicUrl: string) => {
  const bucketUrlSegment = `/${BUCKET}/`;
  const indexOfSegment = publicUrl.indexOf(bucketUrlSegment);

  if (indexOfSegment === -1) return null;
  return decodeURIComponent(
    publicUrl.substring(indexOfSegment + bucketUrlSegment.length),
  );
};
