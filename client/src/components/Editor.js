import React, { useEffect, useRef } from "react";
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { whiteDark } from "@uiw/codemirror-themes-all"
import { autocompletion } from '@codemirror/autocomplete';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { ACTIONS } from "../Actions";

function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);

  useEffect(() => {
    const init = () => {
      const editor = new EditorView({
        state: EditorState.create({
          doc: '',
          extensions: [
            keymap.of([...defaultKeymap, ...closeBracketsKeymap]),
            javascript(),
            whiteDark,
            autocompletion(),
            closeBrackets(),
            lineNumbers(),
            EditorView.updateListener.of(update => {
              if (update.docChanged) {
                const code = update.state.doc.toString();
                onCodeChange(code);
                if (update.transactions[0].isUserEvent('input')) {
                  socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                  });
                }
              }
            })
          ],
        }),
        parent: editorRef.current
      });

      editorViewRef.current = editor;
    };

    init();

    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && editorViewRef.current) {
          const update = editorViewRef.current.state.update({
            changes: { from: 0, to: editorViewRef.current.state.doc.length, insert: code }
          });
          editorViewRef.current.dispatch(update);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div ref={editorRef} style={{ height: "100%" }}></div>
  );
}

export default Editor;
