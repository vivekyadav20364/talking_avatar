import React, { useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Loader, Environment, useFBX, useAnimations, OrthographicCamera } from '@react-three/drei';
import { MeshStandardMaterial, MeshPhysicalMaterial, Vector2, LineBasicMaterial, LinearEncoding, sRGBEncoding } from 'three';
import _ from 'lodash';
import * as THREE from 'three';

import createAnimation from '../converter';
import blinkData from '../blendDataBlink.json';
import axios from 'axios';
import { baseUrl } from "../utils/baseUri";

// const host = 'http://localhost:5000';
const host = `${baseUrl}`;
// -------------------------------------- Some useFull functions ------------------------
function makeSpeech(text) {
  return axios.post(`${host}/talk`, { text });
}


// --------------------------------- End ----------------------------------

function Avatar({ avatar_url, speak, setSpeak, text, setAudioSource, playing }) {
  
    const gltf = useGLTF(avatar_url);
    let morphTargetDictionaryBody = null;
    let morphTargetDictionaryLowerTeeth = null;
  
    const [bodyTexture, eyesTexture, teethTexture, bodySpecularTexture, bodyRoughnessTexture, bodyNormalTexture,
      teethNormalTexture, hairTexture, tshirtDiffuseTexture, tshirtNormalTexture, tshirtRoughnessTexture,
      hairAlphaTexture, hairNormalTexture, hairRoughnessTexture] = useTexture([
      "/images/body.webp", "/images/eyes.webp", "/images/teeth_diffuse.webp", "/images/body_specular.webp",
      "/images/body_roughness.webp", "/images/body_normal.webp", "/images/teeth_normal.webp", "/images/h_color.webp",
      "/images/tshirt_diffuse.webp", "/images/tshirt_normal.webp", "/images/tshirt_roughness.webp",
      "/images/h_alpha.webp", "/images/h_normal.webp", "/images/h_roughness.webp",
    ]);
  
    _.each([bodyTexture, eyesTexture, teethTexture, teethNormalTexture, bodySpecularTexture, bodyRoughnessTexture,
      bodyNormalTexture, tshirtDiffuseTexture, tshirtNormalTexture, tshirtRoughnessTexture, hairAlphaTexture,
      hairNormalTexture, hairRoughnessTexture], t => {
      t.encoding = sRGBEncoding;
      t.flipY = false;
    });
  
    bodyNormalTexture.encoding = LinearEncoding;
    tshirtNormalTexture.encoding = LinearEncoding;
    teethNormalTexture.encoding = LinearEncoding;
    hairNormalTexture.encoding = LinearEncoding;
  
    gltf.scene.traverse(node => {
      if (node.type === 'Mesh' || node.type === 'LineSegments' || node.type === 'SkinnedMesh') {
        node.castShadow = true;
        node.receiveShadow = true;
        node.frustumCulled = false;
  
        if (node.name.includes("Body")) {
          node.material = new MeshPhysicalMaterial();
          node.material.map = bodyTexture;
          node.material.roughness = 1.7;
          node.material.roughnessMap = bodyRoughnessTexture;
          node.material.normalMap = bodyNormalTexture;
          node.material.normalScale = new Vector2(0.6, 0.6);
          morphTargetDictionaryBody = node.morphTargetDictionary;
          node.material.envMapIntensity = 0.8;
        }
  
        if (node.name.includes("Eyes")) {
          node.material = new MeshStandardMaterial();
          node.material.map = eyesTexture;
          node.material.roughness = 0.1;
          node.material.envMapIntensity = 0.5;
        }
  
        if (node.name.includes("Brows")) {
          node.material = new LineBasicMaterial({color: 0x000000});
          node.material.linewidth = 1;
          node.material.opacity = 0.5;
          node.material.transparent = true;
          node.visible = false;
        }
  
        if (node.name.includes("Teeth")) {
          node.material = new MeshStandardMaterial();
          node.material.roughness = 0.1;
          node.material.map = teethTexture;
          node.material.normalMap = teethNormalTexture;
          node.material.envMapIntensity = 0.7;
        }
  
        if (node.name.includes("Hair")) {
          node.material = new MeshStandardMaterial();
          node.material.map = hairTexture;
          node.material.alphaMap = hairAlphaTexture;
          node.material.normalMap = hairNormalTexture;
          node.material.roughnessMap = hairRoughnessTexture;
          node.material.transparent = true;
          node.material.depthWrite = false;
          node.material.side = 2;
          node.material.color.setHex(0x000000);
          node.material.envMapIntensity = 0.3;
        }
  
        if (node.name.includes("TSHIRT")) {
          node.material = new MeshStandardMaterial();
          node.material.map = tshirtDiffuseTexture;
          node.material.roughnessMap = tshirtRoughnessTexture;
          node.material.normalMap = tshirtNormalTexture;
          node.material.color.setHex(0xffffff);
          node.material.envMapIntensity = 0.5;
        }
  
        if (node.name.includes("TeethLower")) {
          morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
        }
      }
    });
  
    const [clips, setClips] = useState([]);
    const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), []);
  
    useEffect(() => {
      // if (speak) {
      //   setClips([]);
      //   setAudioSource(null);
      // }
    
      if (!speak) return;
    
      makeSpeech(text)
        .then((response) => {
          const { blendData, filename } = response.data;
          const newClips = [
            createAnimation(blendData, morphTargetDictionaryBody, "HG_Body"),
            createAnimation(blendData, morphTargetDictionaryLowerTeeth, "HG_TeethLower"),
          ];
    
          const fullFilename = host + filename; // Backend path
          const audioSrc = `${fullFilename}?timestamp=${Date.now()}`; // Unique URL
          setClips(newClips);
          setAudioSource(audioSrc); // Set new audio source
        })
        .catch((err) => {
          console.error(err);
          setSpeak(false);
        });
    
      // return () => {
      //   setClips([]);
      //   setAudioSource(null);
      // };
    }, [speak, text, setAudioSource]);
  
    const idleFbx = useFBX('/idle.fbx');
    const { clips: idleClips } = useAnimations(idleFbx.animations);
  
    idleClips[0].tracks = _.filter(idleClips[0].tracks, track => {
      return track.name.includes("Head") || track.name.includes("Neck") || track.name.includes("Spine2");
    }).map(track => {
      if (track.name.includes("Head")) {
        track.name = "head.quaternion";
      } else if (track.name.includes("Neck")) {
        track.name = "neck.quaternion";
      } else if (track.name.includes("Spine")) {
        track.name = "spine2.quaternion";
      }
      return track;
    });
  
    useEffect(() => {
      const idleClipAction = mixer.clipAction(idleClips[0]);
      idleClipAction.play();
  
      const blinkClip = createAnimation(blinkData, morphTargetDictionaryBody, 'HG_Body');
      const blinkAction = mixer.clipAction(blinkClip);
      blinkAction.play();
    }, [mixer, idleClips]);
  
    useEffect(() => {
      if (!playing) return;
      clips.forEach(clip => {
        const clipAction = mixer.clipAction(clip);
        clipAction.setLoop(THREE.LoopOnce);
        clipAction.play();
      });
    }, [playing, clips, mixer]);
  
    useFrame((state, delta) => mixer.update(delta));
  
    return (
      <group name="avatar">
        <primitive object={gltf.scene} dispose={null} />
      </group>
    );
  }

  export default Avatar;