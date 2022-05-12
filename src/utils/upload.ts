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
  return uploadImage(`avatars/${user.firebaseUser.uid}`, blob, opts);
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
    `uploads/${user.firebaseUser.uid}/${opts?.path ?? uuidv4()}/${file.name}`,
    file,
    opts
  );
}

// TODO: Assumes file allows public reads
export function getUrl(blobName: string): Promise<string> {
  return getDownloadURL(ref(getStorage(), blobName));
}
