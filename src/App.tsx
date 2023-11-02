import React, {useState} from 'react';
import axios from "axios";
import styles from './App.module.css';

const serverUrl = 'https://parser-image-backend-ahvijonuza-de.a.run.app' || process.env.REACT_APP_SERVER_URL;

function App() {
    const [image, setImage] = useState<string | ArrayBuffer | null>('');
    const [base64String, setBase64String] = useState<string | ArrayBuffer | null>('');
    const [response, setResponse] = useState<string | ArrayBuffer | null>('');
    const [loading, setLoading] = useState<boolean>(false);

    function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
        try{
            const file = e.clipboardData.files[0];
            if (!file.type.startsWith('image/')) {
                alert('Please paste an image file');
            }
            else {
                const blob = new Blob([file], {type: file.type});
                const imageUrl = URL.createObjectURL(blob);

                setImage(imageUrl);

                //read file to base64 string
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    if (typeof reader.result === 'string') {
                        console.log(reader.result);
                        const base64String = reader.result.split(',')[1];
                        setBase64String(base64String);
                    }
                }
            }
        }
        catch (e) {
            alert('Please paste an image file');
            return;
        }
    }

    function handleOnClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        setLoading(true)
        axios.post(serverUrl+'/base64ImageParser',
            {
                filename: 'filename',
                body: base64String
            },
            {headers: {'Content-Type': 'application/json'}}
            ).then((response) => {
                console.log(response);
                setResponse(response.data["parser"]);
        }).catch((error) => {
            alert('Error: ' + error);
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <>
            {image && <img src={image.toString()} alt="Pasted from clipboard" />}
            {base64String &&
                <>
                    <br/>
                    Base64 String:
                    <br/>
                    <textarea value={base64String.toString()} readOnly={true} />
                    <br/>
                    <button onClick={handleOnClick} > Submit </button>
                </>
            }
            <br/>
            <br/>
              <textarea
                  placeholder="Paste a file from clipboard here"
                  onPaste={handlePaste}
                  readOnly={true}
              />
            {loading && <p> Loading... </p>}
            {response &&
                <>
                    <br/>
                    Response:
                    <br/>
                    <textarea className={styles.resp} value={response.toString()} readOnly={true} />
                </>
                }
        </>
    );
}

export default App;
