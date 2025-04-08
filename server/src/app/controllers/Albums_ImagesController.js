import Albums_Images from '../models/Albums_Images.js';

class Albums_ImagesController {
    // Get localhost/images/
    async getAllImageswithId_album(req, res) {
        const ImageswithId_album = await Albums_Images.getAllImageswithId_album();
        console.log(ImageswithId_album)
        return res.status(201).json({ data: ImageswithId_album });
    }
    async addImagesToAlbum(req, res) {
        await Albums_Images.addImagesToAlbum(req.body);
        return res.status(201).json({ data: 'Success' });
    }
    

}

export default new Albums_ImagesController();