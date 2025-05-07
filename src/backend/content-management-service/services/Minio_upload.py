import os
import subprocess
from minio import Minio
from io import BytesIO
import logging

client = Minio("minio:9000",
        access_key="user",
        secret_key="userpassword",
        secure=False,
)

def MinioUpload(bucket,filename,file):
    client.put_object(
        bucket_name=bucket,
        object_name=filename,
        data=file,
        length=file.getbuffer().nbytes
    )


def hls_export_upload(rawfile,filename):
    
    os.makedirs("temp_hls", exist_ok=True)

    cmd = [
        "ffmpeg","-f","mp3",
        "-i","-",
        "-map", "0:a", "-map", "0:a", "-map", "0:a",
        "-c:a", "aac",
        "-b:a:0", "64k", 
        "-b:a:1", "128k",
        "-b:a:2", "192k",
        "-f", "hls",'-var_stream_map "a:0 a:1 a:2"',
        "-hls_time", "10",
        "-hls_playlist_type", "event",
        "-hls_segment_filename", f'temp_hls/{filename}_%03d.ts',
        f'temp_hls/{filename}.m3u8'
    ]
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    process.communicate(rawfile.read())

    for file in os.listdir("temp_hls"):
        file_path = os.path.join("temp_hls", file)
        with open(file_path, "rb") as f:
            data = BytesIO(f.read())
            MinioUpload('audiobooks',file,data)
        logging.info(f"Uploaded: {file}")

    for file in os.listdir("temp_hls"):
        os.remove(os.path.join("temp_hls", file))
    os.rmdir("temp_hls")
