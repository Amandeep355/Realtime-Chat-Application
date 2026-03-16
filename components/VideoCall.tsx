"use client"

import { useEffect, useRef, useState } from "react"
import { getSocket } from "../lib/socket"

export default function VideoCall({
  room,
  username
}: {
  room: string
  username: string
}) {

  const socket = getSocket()

  const localVideo = useRef<HTMLVideoElement>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)

  const peerRef = useRef<RTCPeerConnection | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [incomingCall, setIncomingCall] = useState(false)
  const [callerId, setCallerId] = useState("")
  const [callActive, setCallActive] = useState(false)

  /* ---------- Create Peer ---------- */

  const createPeer = () => {

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    })

    peer.ontrack = (event) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = event.streams[0]
      }
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          room
        })
      }
    }

    peerRef.current = peer
    return peer
  }

  /* ---------- Get Local Stream ---------- */

  const getStream = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    streamRef.current = stream

    if (localVideo.current) {
      localVideo.current.srcObject = stream
    }

    return stream
  }

  /* ---------- Start Call (Caller) ---------- */

  const startCall = async () => {

    await getStream()

    const peer = createPeer()

    streamRef.current?.getTracks().forEach(track => {
      peer.addTrack(track, streamRef.current!)
    })

    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)

    socket.emit("call-user", { offer, room })

    setCallActive(true)

  }

  /* ---------- Accept Call (Receiver) ---------- */

  const acceptCall = async () => {

    setIncomingCall(false)

    await getStream()

    const peer = createPeer()

    streamRef.current?.getTracks().forEach(track => {
      peer.addTrack(track, streamRef.current!)
    })

    socket.emit("accept-call", { callerId })

  }

  /* ---------- End Call ---------- */

  const endCall = () => {

    peerRef.current?.close()
    peerRef.current = null

    streamRef.current?.getTracks().forEach(track => track.stop())

    socket.emit("end-call", { room })

    setCallActive(false)

  }

  /* ---------- Socket Events ---------- */

  useEffect(() => {

    /* Incoming call */

    socket.on("incoming-call", ({ callerId }) => {

      setIncomingCall(true)
      setCallerId(callerId)

    })

    /* Receive offer */

    socket.on("call-user", async ({ offer, callerId }) => {

      setCallerId(callerId)

      const peer = peerRef.current
      if (!peer) return

      await peer.setRemoteDescription(
        new RTCSessionDescription(offer)
      )

      const answer = await peer.createAnswer()
      await peer.setLocalDescription(answer)

      socket.emit("answer-call", {
        answer,
        caller: callerId
      })

      setCallActive(true)

    })

    /* Receive answer */

    socket.on("call-answered", async ({ answer }) => {

      const peer = peerRef.current
      if (!peer) return

      await peer.setRemoteDescription(
        new RTCSessionDescription(answer)
      )

    })

    /* ICE */

    socket.on("ice-candidate", async ({ candidate }) => {

      try {

        await peerRef.current?.addIceCandidate(
          new RTCIceCandidate(candidate)
        )

      } catch (err) {

        console.error("ICE error", err)

      }

    })

    /* Call end */

    socket.on("call-ended", () => {

      endCall()

    })

    return () => {

      socket.off("incoming-call")
      socket.off("call-user")
      socket.off("call-answered")
      socket.off("ice-candidate")
      socket.off("call-ended")

    }

  }, [])

  return (

    <>
      <button
        onClick={startCall}
        className="p-2 rounded hover:bg-gray-700 text-lg"
      >
        📹
      </button>

      {incomingCall && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/70">

          <div className="bg-gray-900 p-6 rounded-xl text-center">

            <h2 className="text-white mb-4">
              Incoming Video Call
            </h2>

            <div className="flex gap-4 justify-center">

              <button
                onClick={acceptCall}
                className="bg-green-600 px-4 py-2 rounded text-white"
              >
                Accept
              </button>

              <button
                onClick={() => setIncomingCall(false)}
                className="bg-red-600 px-4 py-2 rounded text-white"
              >
                Reject
              </button>

            </div>

          </div>

        </div>

      )}

      {callActive && (

        <div className="fixed bottom-6 right-6 bg-black p-4 rounded-xl shadow-xl">

          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className="w-80 rounded"
          />

          <video
            ref={localVideo}
            autoPlay
            muted
            playsInline
            className="w-32 absolute bottom-4 right-4 rounded border"
          />

          <button
            onClick={endCall}
            className="mt-3 w-full bg-red-600 text-white py-2 rounded"
          >
            End Call
          </button>

        </div>

      )}

    </>

  )

}