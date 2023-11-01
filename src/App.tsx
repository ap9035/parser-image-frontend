import React, {useState} from 'react';
import axios from "axios";

function App() {
    const [image, setImage] = useState<string | ArrayBuffer | null>('');
    const [base64String, setBase64String] = useState<string | ArrayBuffer | null>('');
    const [response, setResponse] = useState<string | ArrayBuffer | null>('');

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
        axios.post('http://localhost:8000/base64ImageParser',
            {
                filename: 'filename',
                body: base64String
            },
            {headers: {'Content-Type': 'application/json'}}
            ).then((response) => {
                console.log(response);
                setResponse(response.data["parser"]);
        })
    }

    return (
        <>
            {image && <img src={image.toString()} alt="Pasted from clipboard" />}
            <br/>
              <textarea
                  placeholder="Paste a file from clipboard here"
                  onPaste={handlePaste}
                  readOnly={true}
              />
            <br/>
            <br/>
            {base64String &&
                <>
                    Base64 String:
                    <br/>
                    <textarea value={base64String.toString()} readOnly={true} /><br/>
                    <button onClick={handleOnClick} > Submit </button>
                </>
            }
            {response &&
                <>
                    Response:
                    <br/>
                    <code> {response.toString()} readOnly={true} </code>
                </>
                }
        </>
    );
}

export default App;
