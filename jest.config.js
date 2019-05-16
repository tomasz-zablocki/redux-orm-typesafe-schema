module.exports = {
  verbose: true,
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'ts',
    'json'
  ],
  rootDir: '.',
  coverageDirectory: '<rootDir>/coverage',
  testMatch: [
    '<rootDir>/src/**/*.+spec.ts',
    '<rootDir>/src/**/*.+typespec.ts'
  ],
  transform: {
    '.typespec.ts': 'dts-jest/transform',
    '.spec.ts': 'ts-jest'
  },
  moduleNameMapper: {
    '@spec/(.*)': '<rootDir>/src/spec/$1'
  },
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json'
    },
    window: {},
    _dts_jest_: {
      compiler_options: './tsconfig.json',
      enclosing_declaration: true,
      test_type: true,
      transpile: true
    }
  },
  reporters: [
    'default',
    'dts-jest/reporter',
    "jest-junit"
  ]
}