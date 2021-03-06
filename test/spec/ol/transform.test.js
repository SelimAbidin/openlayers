import {
  create,
  reset,
  set,
  setFromArray,
  translate,
  scale,
  rotate,
  multiply,
  compose,
  invert,
  apply
} from '../../../src/ol/transform.js';


describe('ol.transform', function() {

  function assertRoughlyEqual(t1, t2) {
    t1.forEach(function(item, index) {
      expect(item).to.roughlyEqual(t2[index], 1e-8);
    });
  }

  describe('create()', function() {
    it('creates an identity transform', function() {
      expect(create()).to.eql([1, 0, 0, 1, 0, 0]);
    });
  });

  describe('reset()', function() {
    it('resets tansform to an identity transform', function() {
      const transform = [1, 2, 3, 4, 5, 6];
      expect(reset(transform)).to.eql([1, 0, 0, 1, 0, 0]);
      expect(transform).to.eql([1, 0, 0, 1, 0, 0]);
    });
  });

  describe('set()', function() {
    it('sets the given values', function() {
      const transform = create();
      expect(set(transform, 1, 2, 3, 4, 5, 6)).to.eql([1, 2, 3, 4, 5, 6]);
      expect(transform).to.eql([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('setFromArray()', function() {
    it('sets values of 2nd transform on 1st transform', function() {
      const transform1 = create();
      const transform2 = [1, 2, 3, 4, 5, 6];
      expect(setFromArray(transform1, transform2)).to.eql(transform2);
      expect(transform1).to.eql(transform2);
    });
  });

  describe('translate()', function() {
    it('applies translation to a transform', function() {
      const transform = create();
      expect(translate(transform, 3, 4)).to.eql([1, 0, 0, 1, 3, 4]);
      expect(transform).to.eql([1, 0, 0, 1, 3, 4]);
    });
  });

  describe('scale()', function() {
    it('applies scaling to a transform', function() {
      const transform = create();
      expect(scale(transform, 3, 4)).to.eql([3, 0, 0, 4, 0, 0]);
      expect(transform).to.eql([3, 0, 0, 4, 0, 0]);
    });
  });

  describe('rotate()', function() {
    it('applies rotation to a transform', function() {
      const transform = create();
      assertRoughlyEqual(rotate(transform, Math.PI / 2), [0, 1, -1, 0, 0, 0]);
      assertRoughlyEqual(transform, [0, 1, -1, 0, 0, 0]);
    });
  });

  describe('multiply()', function() {
    it('multiplies two transforms', function() {
      const transform1 = [1, 2, 1, 2, 1, 2];
      const transform2 = [1, 2, 1, 2, 1, 2];
      expect(multiply(transform1, transform2)).to.eql([3, 6, 3, 6, 4, 8]);
      expect(transform1).to.eql([3, 6, 3, 6, 4, 8]);
    });
  });

  describe('compose()', function() {
    it('composes a translate, scale, rotate, translate transform', function() {
      const dx1 = 3;
      const dy1 = 4;
      const sx = 1.5;
      const sy = -1.5;
      const angle = Math.PI / 3;
      const dx2 = -dx1 / 2;
      const dy2 = -dy1 / 2;

      const expected = create();
      translate(expected, dx1, dy1);
      scale(expected, sx, sy);
      rotate(expected, angle);
      translate(expected, dx2, dy2);

      const composed = create();
      const composedReturn = compose(composed, dx1, dy1, sx, sy, angle, dx2, dy2);
      expect(composed).to.equal(composedReturn);
      expect(composed).to.eql(expected);
    });
  });

  describe('invert()', function() {
    it('inverts a transform', function() {
      let transform = [1, 0, 1, 0, 1, 0];
      expect(function() {
        invert(transform);
      }).to.throwException();
      transform = [1, 1, 1, 2, 2, 0];
      expect(invert(transform)).to.eql([2, -1, -1, 1, -4, 2]);
      expect(transform).to.eql([2, -1, -1, 1, -4, 2]);
    });
  });

  describe('apply()', function() {
    it('applies a transform to a 2d vector', function() {
      const transform = translate(create(), 2, 3);
      const point = [1, 2];
      expect(apply(transform, point)).to.eql([3, 5]);
      expect(point).to.eql([3, 5]);
    });
  });

});
