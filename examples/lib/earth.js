const {shaders, Sphere} = spritejs.ext3d;
const defaultEarthFragment = `precision highp float;
  precision highp int;

  varying vec3 vNormal;
  varying vec4 vColor;

  uniform sampler2D tMap;
  varying vec2 vUv;
  varying vec3 vDiffuse;

  uniform vec2 uResolution;
  uniform vec4 ambientColor; // 环境光

  void main() {
    vec4 color = vColor;
    vec4 texColor = texture2D(tMap, vUv);

    float alpha = texColor.a;
    color.rgb = mix(texColor.rgb, color.rgb, 1.0 - alpha);
    color.a = texColor.a + (1.0 - texColor.a) * color.a;

    vec3 ambient = ambientColor.rgb * color.rgb * ambientColor.a;// 计算环境光反射颜色
    color = vec4(vDiffuse + ambient, color.a);

    vec2 st = gl_FragCoord.xy / uResolution;
    float d = distance(st, vec2(0.5));

    gl_FragColor.rgb = color.rgb + 0.3 * pow((1.0 - d), 3.0);
    gl_FragColor.a = color.a;
  }  
`;

const defaultEarthVertex = shaders.GEOMETRY_WITH_TEXTURE.vertex;

const defaultAttrs = {
  radius: 1,
  colors: '#333',
  rotateX: -30,
  rotateY: 210,
  widthSegments: 64,
  heightSegments: 32,
};

export function createEarth(layer, {vertex = defaultEarthVertex, fragment = defaultEarthFragment, texture, ...attrs} = {}) {
  const program = layer.createProgram({
    fragment,
    vertex,
    // transparent: true,
    cullFace: null,
    texture,
  });

  attrs = Object.assign({}, defaultAttrs, attrs);

  const earth = new Sphere(program, attrs);
  layer.append(earth);

  return earth;
}