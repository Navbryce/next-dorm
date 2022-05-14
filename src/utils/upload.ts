import { v4 as uuidv4 } from "uuid";
import { User } from "src/types/types";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

type UploadOpts = {
  onProgress?: (number: number) => void;
};

export function uploadImage(
  path: string,
  file: Blob,
  opts: UploadOpts | undefined
): Promise<string> {
  const storage = getStorage();
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((onResolve, onError) =>
    uploadTask.on(
      "state_changed",
      (snapshot) =>
        opts?.onProgress &&
        opts.onProgress(snapshot.bytesTransferred / snapshot.totalBytes),
      (error) => onError(error),
      () => onResolve(storageRef.fullPath)
    )
  );
}

export function uploadAvatar(user: User, blob: Blob, opts: UploadOpts) {
  return uploadImage(`uploads/${user.firebaseUser.uid}/avatar`, blob, opts);
}

/**
 *
 * @param user
 * @param file
 * @param opts
 *
 * @return the blob name
 */
export function uploadContentImage(
  user: User,
  file: File,
  opts: UploadOpts & { path?: string }
): Promise<string> {
  return uploadImage(
    `uploads/${user.firebaseUser.uid}/content/${opts?.path ?? uuidv4()}/${
      file.name
    }`,
    file,
    opts
  );
}

// TODO: Assumes file allows public reads and is an image
export function getPublicUrlForImage(blobName: string): string {
  const storageRef = ref(getStorage(), blobName);
  return `https://firebasestorage.googleapis.com/v0/b/${
    storageRef.bucket
  }/o/${encodeURIComponent(storageRef.fullPath)}?alt=media`;
}
