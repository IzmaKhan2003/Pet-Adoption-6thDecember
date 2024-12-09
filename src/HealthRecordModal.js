<Modal
  open={healthRecordOpen}
  onClose={handleHealthRecordClose}
  aria-labelledby="health-record-modal-title"
  aria-describedby="health-record-modal-description"
>
  <Box sx={modalStyle}>
    <Typography id="health-record-modal-title" variant="h6" component="h2">
      Health Record
    </Typography>
    <Box id="health-record-modal-description" sx={{ mt: 2 }}>
      {healthRecordData.length > 0 ? (
        <ul>
          {healthRecordData.map((record, index) => (
            <li key={index}>
              <strong>{record.RecordType}</strong>: {record.Details}
            </li>
          ))}
        </ul>
      ) : (
        <Typography>No health records found for this pet.</Typography>
      )}
    </Box>
  </Box>
</Modal>
