import { v4 as uuidv4 } from "uuid";
import { User } from "src/types/types";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

type UploadOpts = {
  path?: string;
  onProgress?: (number: number) => void;
};

/**
 *
 * @param user
 * @param file
 * @param opts
 *
 * @return the blob name
 */
export function uploadImage(
  user: User,
  file: File,
  opts: UploadOpts | undefined
): Promise<string> {
  const storage = getStorage();
  const storageRef = ref(
    storage,
    `uploads/${user.firebaseUser.uid}/${opts?.path ?? uuidv4()}/${file.name}`
  );
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

// TODO: Assumes file is public read
export function getUrl(blobName: string): Promise<string> {
  return getDownloadURL(ref(getStorage(), blobName));
}
